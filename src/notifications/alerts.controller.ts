import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  createAlert(@Req() req: any, @Body() dto: CreateAlertDto) {
    console.log('DTO reçu:', dto);
  console.log('Body brut:', req.body);
    return this.notificationsService.createAlert(req.user.id, dto);
  }

  @Delete(':id')
  deleteAlert(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.deleteAlert(id, req.user.id);
  }

  @Get()
  getMyAlerts(@Req() req: any) {
    return this.notificationsService.getMyAlerts(req.user.id);
  }

  @Get('notifications')
  getNotifications(@Req() req: any) {
    return this.notificationsService.getMyNotifications(req.user.id);
  }

  @Patch('notifications/:id/read')
  markAsRead(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('notifications/read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
