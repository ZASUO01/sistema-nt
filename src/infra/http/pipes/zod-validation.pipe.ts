import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodObject } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('validation failed')
    }
  }
}
