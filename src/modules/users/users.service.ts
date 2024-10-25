/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, PaginateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterQuery, Schema, SchemaTypes, Types } from 'mongoose';
import { UserRepository } from './entities/user.repository';
import { EmailService } from 'src/common/services/email/email.service';
import { RoleRepository } from '../auth/entities/auth.repository';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly rolesRepository: RoleRepository,
    private readonly uploadService: CloudinaryService,
  ) {}

  async updateOtp(email: string, payload: any): Promise<void> {
    console.log('Updating ', email, payload);
    await this.userRepository.update(
      { email: email },
      {
        ...payload,
      },
    );
  }
  async create(payload: CreateUserDto) {
    try {
      const isExist = await this.userRepository.exists({
        $or: [
          { email: payload?.email },
          { fullName: payload?.fullName },
          { phoneNumber: payload?.phoneNumber },
        ],
      });

      if (isExist) {
        throw new BadRequestException('User already exists');
      }

      const role = await this.rolesRepository.byQuery({ name: 'User' });

      // TODO: Implement attachments
      const attachments = [
        // {
        //   filename: 'example.pdf',
        //   path: './path-to-file/example.pdf',
        // },
        // {
        //   filename: 'image.png',
        //   path: './path-to-image/image.png',
        //   cid: 'unique@image.cid',
        // },
      ];

      const user = await this.userRepository.create({
        ...payload,
        roles: [
          {
            roleId: role.id,
            customPermissions: [],
          },
        ],
      });
      await this.emailService.sendMail(
        payload?.email,
        'Registration successful',
        'Your account has been registered successfully',
        '<h1>Your account has been registered successfully.</h1>',
        // attachments,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private buildOrQuery(
    conditions: Partial<Record<string, any>>,
  ): FilterQuery<any> {
    const orConditions = [];

    for (const [key, value] of Object.entries(conditions)) {
      if (value !== undefined) {
        orConditions.push({ [key]: value });
      }
    }

    return orConditions.length > 0 ? { $or: orConditions } : {};
  }

  async updateProfilePicture(userId: any, file: any) {
    const user = await this.userRepository.byID(userId);

    // Delete the previous profile picture if it exists
    if (user?.profilePictureMetaData?.publicId) {
      await this.uploadService.deleteImage(
        user?.profilePictureMetaData?.publicId,
      );
    }

    // Upload the new profile picture
    const uploadResult = await this.uploadService.uploadImage(
      file,
      'profile_pictures',
    );

    // Update the user's profile picture URL and public ID in the database
    await this.userRepository.update(
      { _id: userId },
      {
        ProfilePicture: uploadResult.secure_url,
        profilePictureMetaData: {
          publicId: uploadResult.public_id,
        },
      },
    );

    return {
      message: 'Profile picture updated successfully',
      url: uploadResult.secure_url,
    };
  }

  async getAnalytics(query: object, pagination: object): Promise<any> {
    const data = await this.userRepository.paginate({
      ...pagination,
      conditions: { ...query },
    });

    return {
      statusCode: 200,
      message: 'Users found successfully',
      data,
    };
  }

  async findAll(payload: PaginateUserDto): Promise<any> {
    try {
      payload.conditions.isDeleted = false;
      payload.conditions.isSuperAdmin = false;

      payload.conditions = this.buildOrQuery(payload.conditions);

      console.log(payload);
      const users = await this.userRepository.paginate({
        ...payload,
        populate: [
          {
            path: 'roles.roleId',
            model: 'Role',
            // select: '-createdAt -updatedAt',
          },
          // {
          //   path: 'subscriptions.subscriptionId',
          //   model: 'Subscription',
          //   // select: '-createdAt -updatedAt',
          // },
        ],
      });

      if (!users || !users.data.length) {
        throw new NotFoundException('No users found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Users found successfully',
        data: users,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email: string): Promise<any> {
    try {
      const user = await this.userRepository.byQuery(
        { email: email },
        null,
        null,
        [
          {
            path: 'roles.roleId',
            model: 'Role',
            // select: '-createdAt -updatedAt',
          },
          // {
          //   path: 'subscriptions.subscriptionId',
          //   model: 'Subscription',
          //   // select: '-createdAt -updatedAt',
          // },
        ],
        '-createdAt',
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findUserByToken(authToken: string): Promise<any> {
    try {
      const user = await this.userRepository.byQuery(
        { authToken: authToken },
        null,
        null,
        [
          {
            path: 'roles.roleId',
            model: 'Role',
            // select: '-createdAt -updatedAt',
          },
          // {
          //   path: 'subscriptions.subscriptionId',
          //   model: 'Subscription',
          //   // select: '-createdAt -updatedAt',
          // },
        ],
        '-createdAt',
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string): Promise<any> {
    try {
      console.log(id);
      const user = await this.userRepository.byQuery(
        { _id: id },
        null,
        null,
        [
          {
            path: 'roles.roleId',
            model: 'Role',
            // select: '-createdAt -updatedAt',
          },
          // {
          //   path: 'subscriptions.subscriptionId',
          //   model: 'Subscription',
          //   // select: '-createdAt -updatedAt',
          // },
        ],
        '-createdAt',
      );
      console.log('USER>>>> ', user);

      if (!user || user instanceof Error) {
        throw new NotFoundException('User not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User found successfully',
        data: user,
      };
    } catch (error: any) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: any, payload: UpdateUserDto) {
    try {
      const isExist = await this.userRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = await this.userRepository.update(id, {
        // $set: { name: payload. },
        // $push: { permissions: payload.permissions },
        payload,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async createSuperAdmin(payload: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
  }): Promise<any> {
    try {
      const isUserExists = await this.userRepository.exists({
        role: 'superadmin',
      });

      if (isUserExists) {
        throw new HttpException('Superadmin already exists', 409);
      }

      const superAdmin = {
        email: payload.email,
        password: payload.password,
        fullName: payload.fullName,
        role: 'SuperAdmin',
        phoneNumber: payload.phoneNumber,
      };

      const data = await this.userRepository.create(superAdmin);
      return {
        statusCode: 201,
        message: 'Superadmin created successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error?.message, error?.statusCode);
    }
  }

  async findByEmail(email: string, password: string): Promise<any> {
    try {
      const user = await this.userRepository.byQuery(
        { email: email },
        ['+password'],
        null,
        [
          {
            path: 'roles.roleId',
            model: 'Role',
            // select: '-createdAt -updatedAt',
          },
          // {
          //   path: 'subscriptions.subscriptionId',
          //   model: 'Subscription',
          //   // select: '-createdAt -updatedAt',
          // },
        ],
      );
      if (!user || !(await user.comparePassword(password))) {
        throw new BadRequestException('Invalid email or password');
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error?.message, error?.statusCode);
    }
  }

  async userStatusChange(
    id: any,
    payload: { status: string; reason?: string },
  ) {
    try {
      const isExist = await this.userRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.update(id, {
        // $set: { name: payload. },
        // $push: { permissions: payload.permissions },
        $set: { status: payload.status, statusReason: payload?.reason },
      });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'User ' + ' ' + payload.status + ' ' + ' updated successfully',
        // data: updatedUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: any) {
    try {
      const isExist = await this.userRepository.exists({ _id: id });

      if (!isExist) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.update(
        { _id: id },
        { isDeleted: true, deletedAt: new Date() },
      );

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
