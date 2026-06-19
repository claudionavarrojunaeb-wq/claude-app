import { Controller, Get, UseGuards, Req, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('users')
export class UsersController {
  /** Returns the current authenticated user's profile (from JWT) */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    return { user: req.user };
  }

  /** Example: list all users — in production, query LDAP here */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return {
      users: [
        { username: 'garcia.sofia',    displayName: 'Sofía García',    department: 'IT' },
        { username: 'martinez.juan',   displayName: 'Juan Martínez',   department: 'Finanzas' },
        { username: 'rodriguez.pablo', displayName: 'Pablo Rodríguez', department: 'RRHH' },
      ],
    };
  }
}

@Module({
  imports: [
    JwtModule.register({
      secret:      process.env.JWT_SECRET || 'change-me',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
