import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LectureService } from '../services/lecture.service.impl';
import { CreateLectureDto } from '../dto/create-lecture.dto';
import { UpdateLectureDto } from '../dto/update-lecture.dto';

@Controller('lecture')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Get('cancel/:id')
  async cancelLecture(@Param('id') id: string) {
    return await this.lectureService.cancelLecture(id);
  }

  @Post('create')
  async createLecture(@Body() createLectureDto: CreateLectureDto) {
    return await this.lectureService.createLecture(createLectureDto);
  }

  @Get('gets')
  async getAllLectures() {
    return await this.lectureService.getAllLectures();
  }
}
