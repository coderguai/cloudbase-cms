import { Body, Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { RecordNotExistException } from './common'
import { Collection } from './constants'
import { CloudBaseService } from './services'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cloudbaseService: CloudBaseService
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello()
  }

  // 根据 collectionName 查询 collection 信息
  @Post('collectionInfo')
  async getCollectionInfo(@Body() body) {
    const { collectionName } = body
    const {
      data: [schema],
    } = await this.cloudbaseService
      .collection(Collection.Schemas)
      .where({
        collectionName,
      })
      .get()

    if (!schema) {
      throw new RecordNotExistException('数据集合不存在')
    }

    return {
      data: schema,
    }
  }
}
