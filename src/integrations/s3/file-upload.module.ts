import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [FileUploadService],
  exports: [FileUploadService], 
})
export class FileUploadModule {}
