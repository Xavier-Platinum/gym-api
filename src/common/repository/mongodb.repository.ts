import mongoose, {
  ClientSession,
  FilterQuery,
  HydratedDocument,
  Model,
  UnpackedIntersection,
} from 'mongoose';

import {
  PaginationQuery,
  Model as IModel,
  Projections,
  Archived,
  Populate,
  Sort,
  Keys,
  PaginationResult,
  IRepository,
} from './base.repository.interface';

export const createRepoError = (
  message: string,
  name?: string,
  cause?: any,
): Error => {
  const error = new Error(message);
  if (name) error.name = name;
  if (cause) error.stack = cause;
  return error;
};

export abstract class EntityRepository<
  TModel extends IModel<NonNullable<unknown>>,
> implements IRepository<TModel>
{
  name: string;
  //   schema: Schema;
  session: ClientSession | null;
  //   model: import('mongoose').PaginateModel<TModel>;

  constructor(protected readonly model: Model<TModel>) {
    this.name = model.modelName;
  }

  //   Checks if the archived arg is either undefined or passed as a false string in the case of query params, and converts it to a boolean
  private convertArchived = (archived?: string | boolean) =>
    [undefined, 'false', false, null].includes(archived) ? false : true;

  // Converts a passed condition argument to a query
  private getQuery = (condition: string | Partial<TModel>) =>
    typeof condition === 'string' ? { _id: condition } : { ...condition };

  getModel() {
    return this.model;
  }

  connectDBSession(session: ClientSession) {
    this.session = session;
    if (session && !session.inTransaction()) {
      session.startTransaction();
    }
    return this;
  }
  disconnectDBSession() {
    this.session = null;
    return this;
  }

  async create(attributes: Partial<TModel>): Promise<TModel> {
    try {
      const [doc] = await this.model.create([attributes], {
        session: this.session,
      });
      return doc?.save({ session: this.session });
    } catch (err: any) {
      if (err && err.code === 11000) {
        return Promise.reject(
          createRepoError(
            `${this.name} exists already`,
            'DuplicateError',
            err.keyValue,
          ),
        );
      }
      return Promise.reject(err);
    }
  }

  async byID(
    _id: string,
    projections?: Projections<TModel>,
    archived?: Archived,
  ): Promise<HydratedDocument<TModel>> {
    archived = this.convertArchived(archived || false);
    return this.model
      .findOne({
        _id: new mongoose.Types.ObjectId(_id),
        ...(!archived
          ? { deleted_at: undefined }
          : { deleted_at: { $ne: undefined } }),
      })
      .lean()
      .session(this.session)
      .select(projections || [])
      .exec()
      .then((result) => {
        if (!result) {
          return Promise.reject(
            createRepoError(`${this.name} not found`, 'ModelNotFoundError'),
          );
        }
        return result as never as Promise<HydratedDocument<TModel>>;
      });
  }

  async all(query: PaginationQuery<TModel>): Promise<TModel[]> {
    const sort = query.sort || 'createdAt';
    const archived = this.convertArchived(query.archived || false);
    try {
      return await this.model
        .find({
          ...query.conditions,
          ...(!archived
            ? { deleted_at: undefined }
            : {
                $or: [
                  { deleted_at: { $ne: undefined } },
                  { deleted_at: undefined },
                ],
              }),
        })
        .session(this.session)
        .skip(query.skip || 0)
        .limit(query.limit || 0)
        .select(query?.projections || [])
        .populate(query?.populate || [])
        .sort(sort);
      // .lean();
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  async paginateV2(
    query: PaginationQuery<TModel>,
  ): Promise<PaginationResult<TModel>> {
    const page = Number(query.page) - 1 || 0;
    const limit = Number(query.limit) || 20;
    const offset = page * limit;
    const sort = query.sort || 'createdAt';
    const archived = this.convertArchived(query.archived || false);
    const dbQuery = {
      ...query.conditions,
      ...(!archived
        ? { deleted_at: undefined }
        : { deleted_at: { $ne: undefined } }),
    };
    return Promise.all([
      this.count(dbQuery),
      new Promise((resolve, reject) => {
        this.model
          .find(dbQuery)
          .session(this.session)
          .limit(limit)
          .select(query.projections || [])
          .populate(query.populate || [])
          .skip(offset)
          .sort(sort)

          .then((result) => {
            resolve({
              page: {
                current: page + 1,
                prev: page > 0 ? page : null,
                next: page <= result.length ? page + 2 : null,
              },
              limit,
              sort,
              data: result,
            });
          })
          .catch((err) => {
            return reject(err);
          });
      }) as Promise<
        Pick<PaginationResult<TModel>, 'page' | 'limit' | 'sort' | 'data'>
      >,
    ]).then(
      ([count, result]) =>
        ({
          ...result,
          data: result.data,
          limit: result.limit,
          sort: result.sort,
          total: count,
          pages: Math.ceil(count / limit),
          page: result.page,
          offset: page * limit,
        }) as PaginationResult<TModel>,
    );
  }

  async paginate(
    query: PaginationQuery<TModel>,
  ): Promise<PaginationResult<TModel>> {
    const page = Number(query.page) - 1 || 0;
    const limit = Number(query.limit) || 20;
    const offset = page * limit;
    const sort = query.sort || 'createdAt';
    const archived = this.convertArchived(query.archived || false);
    const dbQuery = {
      ...query.conditions,
      ...(!archived
        ? { deleted_at: undefined }
        : { deleted_at: { $ne: undefined } }),
    };

    return Promise.all([
      this.count(dbQuery),
      new Promise((resolve, reject) => {
        this.model
          .find(dbQuery)
          .session(this.session)
          .limit(limit)
          .select(query.projections || [])
          .populate(query.populate || [])
          .skip(offset)
          .sort(sort)

          .then((result) => {
            resolve({
              page: {
                current: page + 1,
                prev: page > 0 ? page : null,
                next: page < Math.ceil(result.length / limit) ? page + 2 : null,
              },
              limit,
              sort,
              data: result,
            });
          })
          .catch((err) => {
            return reject(err);
          });
      }) as Promise<
        Pick<PaginationResult<TModel>, 'page' | 'limit' | 'sort' | 'data'>
      >,
    ]).then(
      ([count, result]) =>
        ({
          ...result,
          data: result.data,
          limit: result.limit,
          sort: result.sort,
          total: count,
          pages: Math.ceil(count / limit),
          page: result.page,
          offset: page * limit,
        }) as PaginationResult<TModel>,
    );
  }

  async byQueryPromise(
    query: FilterQuery<TModel>,
    projections?: Projections<TModel>,
    archived?: Archived,
    populate?: Populate<TModel>,
    sort: Sort = '-createdAt',
  ): Promise<
    UnpackedIntersection<HydratedDocument<any>, NonNullable<unknown>>
  > {
    archived = this.convertArchived(archived);

    return new Promise((resolve, reject) => {
      this.model
        .findOne({
          ...query,
          ...(!archived
            ? { deleted_at: undefined }
            : { deleted_at: { $ne: undefined } }),
        })
        .session(this.session)
        .select(projections || [])
        .populate(populate || [])
        .sort(sort)
        .exec()
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.log('NEW ERRL', err);
          reject(
            createRepoError(`${this.name} not found`, 'ModelNotFoundError'),
          );
        });
    });
  }

  async rawFetchQuery(
    query: FilterQuery<TModel>,
    projections?: Projections<TModel>,
    archived?: Archived,
    populate?: Populate<TModel>,
    sort: Sort = '-createdAt',
  ): Promise<HydratedDocument<TModel>> {
    archived = this.convertArchived(archived);

    return this.model
      .findOne({
        ...query,
        ...(!archived
          ? { deleted_at: undefined }
          : { deleted_at: { $ne: undefined } }),
      })

      .session(this.session)
      .select(projections || [])
      .populate(populate || [])
      .sort(sort) as never as Promise<HydratedDocument<TModel>>;
  }

  async byQuery(
    query: FilterQuery<TModel>,
    projections?: Projections<TModel>,
    archived?: Archived,
    populate?: Populate<TModel>,
    sort: Sort = '-createdAt',
  ): Promise<
    UnpackedIntersection<HydratedDocument<any>, NonNullable<unknown>>
  > {
    archived = this.convertArchived(archived);

    return this.model
      .findOne({
        ...query,
        ...(!archived
          ? { deleted_at: undefined }
          : { deleted_at: { $ne: undefined } }),
      })

      .session(this.session)
      .select(projections || [])
      .populate(populate || [])
      .sort(sort)
      .exec()
      .then((result) => {
        if (!result) {
          return Promise.reject(
            createRepoError(`${this.name} not found`, 'ModelNotFoundError'),
          );
        } else {
          return result;
        }
      });
  }

  async byQueryLean(
    query: FilterQuery<TModel>,
    projections?: Projections<TModel>,
    archived?: Archived,
    populate?: Populate<TModel>,
    sort: Sort = '-createdAt',
  ): Promise<
    UnpackedIntersection<HydratedDocument<any>, NonNullable<unknown>>
  > {
    archived = this.convertArchived(archived);

    return this.model
      .findOne({
        ...query,
        ...(!archived
          ? { deleted_at: undefined }
          : { deleted_at: { $ne: undefined } }),
      })
      .lean()
      .session(this.session)
      .select(projections || [])
      .populate(populate || [])
      .sort(sort)
      .exec()
      .then((result) => {
        if (!result) {
          return Promise.reject(
            createRepoError(`${this.name} not found`, 'ModelNotFoundError'),
          );
        } else {
          return result;
        }
      });
  }

  count(query: FilterQuery<TModel>): Promise<number> {
    return new Promise((resolve, reject) => {
      this.model
        .countDocuments({
          ...query,
        })
        .session(this.session)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }

  distinct(field: Keys<TModel>, query: FilterQuery<TModel>): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.model
        .distinct(field, {
          ...query,
        })
        .lean()
        .session(this.session)
        .then((result: any) => resolve(result))
        .catch((err) => reject(err));
    });
  }

  countDistinct(
    field: Keys<TModel>,
    query: FilterQuery<TModel>,
  ): Promise<number> {
    return this.distinct(field, query).then((ids) => ids.length);
  }
  exists(query: FilterQuery<TModel>): Promise<boolean> {
    return this.model.exists(query).then((result) => !!result);
  }

  //  updates a single document that matches a particular condition by triggering mongoose `save` hooks.
  async update(
    condition: FilterQuery<TModel>,
    update:
      | mongoose.UpdateWithAggregationPipeline
      | mongoose.UpdateQuery<TModel>,
  ): Promise<HydratedDocument<TModel>> {
    const query = this.getQuery(condition);

    try {
      const doc = await this.model.findOne(query, null, {
        session: this.session,
        new: false,
      });

      doc.set(update);
      return await doc.save({ session: this.session });
    } catch (error) {
      console.log('ERROR', error);
      return Promise.reject(
        createRepoError(`${this.name} not found`, 'ModelNotFoundError'),
      );
    }
  }
  async findAndUpdate(
    condition: FilterQuery<TModel>,
    update:
      | mongoose.UpdateWithAggregationPipeline
      | mongoose.UpdateQuery<TModel>,
  ): Promise<HydratedDocument<TModel>> {
    try {
      return await this.model.findOneAndUpdate(condition, update, {
        session: this.session,
        returnDocument: 'after',
      });
    } catch (error) {
      return Promise.reject(
        createRepoError(`${this.name} not found`, 'ModelNotFoundError'),
      );
    }
  }

  /**
   * updates multiple documents that match a query
   * @param condition Query condition to mathc against documents
   * @param update  Instructions for how to update the documents
   */
  async updateMany(
    condition: FilterQuery<TModel>,
    update:
      | mongoose.UpdateQuery<TModel>
      | mongoose.UpdateWithAggregationPipeline,
  ): Promise<HydratedDocument<TModel>[]> {
    const query = this.getQuery(condition);

    return this.model
      .updateMany(query, update, { session: this.session })
      .then(
        () =>
          this.all({ conditions: query }) as unknown as Promise<
            HydratedDocument<TModel>[]
          >,
      );
  }

  /**
   * Soft deletes a document by creating deleted_at field in the document and setting it to true
   * @throws a `ModelNotFoundError()` if the model is not found
   * @param condition
   */
  async softDelete(condition: FilterQuery<TModel>): Promise<TModel> {
    const query = this.getQuery(condition);
    const currentDate = new Date();
    const oldDoc = (await this.byQuery(condition)) as TModel;
    oldDoc.deletedAt = currentDate;

    return this.model
      .findOneAndUpdate(
        query,
        { deleted_at: new Date() },
        { new: true, session: this.session },
      )
      .then((result) => {
        if (!result)
          return Promise.reject(
            createRepoError(`${this.name} not found`, 'ModelNotFoundError'),
          );
        return oldDoc;
      });
  }

  /**
   * soft deletes a list of documents by creating `deleted_at` field in the document and setting it to true
   * @param condition
   */
  async softDeleteMany(condition: FilterQuery<TModel>): Promise<any[]> {
    const query = this.getQuery(condition);

    const allDocs = await this.all({ conditions: query });
    const deletedAt = new Date();

    return this.model
      .updateMany(
        query,
        { deleted_at: deletedAt },
        { new: true, session: this.session },
      )
      .then(() => {
        return allDocs.map((doc) => {
          doc.deletedAt = deletedAt;
          return doc;
        });
      });
  }

  /**
   * Deleted a document permanently from the DB
   * @param condition
   */
  async delete(condition: FilterQuery<TModel>): Promise<void> {
    const query = this.getQuery(condition);
    const result = await this.model
      .findOneAndDelete(query, {})
      .session(this.session);
  }
  /**
   * Deleted a document permanently from the DB
   * @param condition
   */
  async deleteAndReturnRecord(
    condition: FilterQuery<TModel>,
  ): Promise<HydratedDocument<TModel>> {
    const query = this.getQuery(condition);
    const result = await this.model
      .findOneAndDelete(query, {})
      .session(this.session);

    return result;
  }

  /**
   * Permanently deletes a list of documents from DB
   * @param condition
   */
  async deleteMany(condition: FilterQuery<TModel>): Promise<void> {
    const query = this.getQuery(condition);
    await this.model.deleteMany(query, { session: this.session });
  }
}
