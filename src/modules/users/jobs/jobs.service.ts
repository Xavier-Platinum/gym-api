import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserPackageRepository } from '../entities/user.repository';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  constructor(private readonly userPkgRepository: UserPackageRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateDurationForActivePackages() {
    this.logger.log('Running midnight cron job to update package durations');

    // Find all active packages with non-null startDate and endDate
    const activePackages = await this.userPkgRepository.all({
      conditions: {
        isActive: true,
        startDate: { $ne: null },
        endDate: { $ne: null },
      },
    });

    const now = new Date();

    for (const pkg of activePackages) {
      // Calculating the time difference in days between now and startDate
      const durationElapsed = Math.floor(
        (now.getTime() - pkg.startDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      // Update if the duration has elapsed
      if (durationElapsed > 0) {
        const newDuration = Math.max(pkg.duration - durationElapsed, 0);

        // Update the package with the new duration and set isActive to false if duration is 0
        await this.userPkgRepository.findAndUpdate(
          { _id: pkg._id },
          {
            $set: {
              duration: newDuration,
              isActive: newDuration > 0,
            },
          },
        );

        this.logger.log(
          `Updated duration for package ${pkg._id} to ${newDuration}`,
        );
      }
    }

    this.logger.log('Completed midnight cron job');
  }
}
