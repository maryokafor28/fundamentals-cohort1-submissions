import { Inject, Injectable, UnauthorizedException, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userTypes } from 'src/shared/schema/users';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import appConfig from '../config/config';
import { UserRepository } from 'src/shared/repositories/user.repository';
import { comparePassword, generateHashPassword } from '../shared/utility/auth-utils';
import { sendEmail } from 'src/shared/utility/mail-handler';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // generate the hash password
      createUserDto.password = await generateHashPassword(createUserDto.password);

      // check if it is for admin
      if (
        createUserDto.type === userTypes.ADMIN &&
        createUserDto.secretToken !== appConfig.adminSecretToken
      ) {
        throw new Error('Not allowed to create admin');
      } else if (createUserDto.type !== userTypes.CUSTOMER) {
        createUserDto.isVerified = true;
      }

      // Check if user already exists
      const existingUser = await this.userDB.findOne({ email: createUserDto.email });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // generate the otp
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      const newUser = await this.userDB.create({
        ...createUserDto,
        otp,
        otpExpiryTime,
      });

      // Temporarily commented out - Mailgun issue
      // if (newUser.type !== userTypes.ADMIN) {
      //   sendEmail(
      //     newUser.email,
      //     appConfig.emailService.emailTemplates.verifyEmail,
      //     'Email verification - mservice',
      //     {
      //       customerName: newUser.name,
      //       customerEmail: newUser.email,
      //       otp,
      //     },
      //   );
      // }

      return {
        success: true,
        message:
          newUser.type === userTypes.ADMIN
            ? 'Admin created successfully'
            : 'Please activate your account by verifying your email. We have sent you an email with the OTP',
        result: { email: newUser.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const userExists = await this.userDB.findOne({ email });
      if (!userExists) {
        throw new UnauthorizedException('Invalid email or password');
      }

      if (!userExists.isVerified) {
        throw new UnauthorizedException('Please verify your email before logging in');
      }

      const isPasswordMatch = await comparePassword(password, userExists.password);
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const payload = {
        sub: String(userExists._id),
        email: userExists.email,
        type: userExists.type,
        name: userExists.name,
      };

      const token = await this.jwtService.signAsync(payload);

      return {
        success: true,
        message: 'Login successful',
        result: {
          user: {
            name: userExists.name,
            email: userExists.email,
            type: userExists.type,
            id: String(userExists._id),
          },
          token,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(otp: string, email: string) {
    try {
      const user = await this.userDB.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isVerified) {
        throw new BadRequestException('Email is already verified');
      }

      if (user.otp !== otp) {
        throw new BadRequestException('Invalid OTP code');
      }

      if (user.otpExpiryTime < new Date()) {
        throw new BadRequestException('OTP has expired. Please request a new one');
      }

      await this.userDB.updateOne({ email }, { isVerified: true });

      return {
        success: true,
        message: 'Email verified successfully. You can login now',
      };
    } catch (error) {
      throw error;
    }
  }

  async sendOtpEmail(email: string) {
    try {
      const user = await this.userDB.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }


      
      if (user.isVerified) {
        throw new BadRequestException('Email is already verified');
      }

      const otp = Math.floor(Math.random() * 900000) + 100000;
      const otpExpiryTime = new Date();
      otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 10);

      await this.userDB.updateOne({ email }, { otp, otpExpiryTime });

      // Temporarily commented out - Mailgun issue
      // sendEmail(
      //   user.email,
      //   appConfig.emailService.emailTemplates.verifyEmail,
      //   'Email verification - mservice',
      //   {
      //     customerName: user.name,
      //     customerEmail: user.email,
      //     otp,
      //   },
      // );

      return {
        success: true,
        message: 'Otp sent successfully',
        result: { email: user.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userDB.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let password = Math.random().toString(36).substring(2, 12);
      const tempPassword = password;
      password = await generateHashPassword(password);

      await this.userDB.updateOne({ _id: String(user._id) }, { password });

      // Temporarily commented out - Mailgun issue
      // sendEmail(
      //   user.email,
      //   appConfig.emailService.emailTemplates.forgotPassword,
      //   'Forgot password - mservice',
      //   {
      //     customerName: user.name,
      //     customerEmail: user.email,
      //     newPassword: tempPassword,
      //     loginLink: appConfig.loginLink,
      //   },
      // );

      return {
        success: true,
        message: 'Password sent to your email',
        result: { email: user.email, password: tempPassword },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users with optional type filter
   */
  async findAll(type?: string) {
    try {
      const query: any = {};
      
      // Filter by type if provided
      if (type && type.trim() !== '') {
        query.type = type;
      }
      
      const users = await this.userDB.find(query);
      
      // Remove sensitive fields
      const sanitizedUsers = users.map(user => {
        const userObj = user.toObject ? user.toObject() : user;
        const { password, otp, otpExpiryTime, ...rest } = userObj;
        return rest;
      });
      
      return {
        success: true,
        message: 'Users retrieved successfully',
        result: sanitizedUsers,
      };
    } catch (error) {
      throw new BadRequestException('Failed to retrieve users');
    }
  }

  /**
   * Update user name or password
   */
  async updatePasswordOrName(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUser: any,
  ) {
    try {
      // Authorization check - users can only update their own profile unless they're admin
      if (currentUser.id !== id && currentUser.type !== userTypes.ADMIN) {
        throw new ForbiddenException('You can only update your own profile');
      }

      // Find the user first
      const user = await this.userDB.findOne({ _id: id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const updateData: any = {};

      // Update name if provided
      if (updateUserDto.name) {
        updateData.name = updateUserDto.name;
      }

      // Update password if provided
      if (updateUserDto.password) {
        // Hash the new password using your utility function
        updateData.password = await generateHashPassword(updateUserDto.password);
      }

      // Update the user
      await this.userDB.updateOne({ _id: id }, updateData);
      
      // Fetch updated user
      const updatedUser = await this.userDB.findOne({ _id: id });
      
      if (!updatedUser) {
        throw new NotFoundException('User not found after update');
      }
      
      // Remove sensitive fields
      const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
      const { password, otp, otpExpiryTime, ...sanitizedUser } = userObj;

      return {
        success: true,
        message: 'User updated successfully',
        result: sanitizedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  /**
   * Delete a user (Admin only)
   */
  async remove(id: string, currentUser: any) {
    try {
      // Authorization check - only admins can delete users
      if (currentUser.type !== userTypes.ADMIN) {
        throw new ForbiddenException('Only administrators can delete users');
      }

      // Prevent admins from deleting themselves
      if (currentUser.id === id) {
        throw new ForbiddenException('You cannot delete your own account');
      }

      // Find the user first to ensure they exist
      const user = await this.userDB.findOne({ _id: id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Delete the user
      await this.userDB.deleteOne({ _id: id });

      return {
        success: true,
        message: 'User deleted successfully',
        result: { id },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete user');
    }
  }
}