import { SuccessResponseMessages } from '@messages';
import { applyDecorators, Type } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiForbiddenResponse, 
  ApiNotFoundResponse, 
  ApiInternalServerErrorResponse, 
  getSchemaPath, 
  ApiExtraModels 
} from '@nestjs/swagger';
import { ApiMessage, ApiMessageData, ApiMessageDataPagination } from '@types';

export interface SwaggerResponseOptions {
  description?: string;
  statusCode?: number;
  type?: Type<any>;
  isArray?: boolean;
}

export function SwaggerApiResponse(
  descriptionOrOptions: string | SwaggerResponseOptions,
  statusCode: number = 200,
) {
  const description = typeof descriptionOrOptions === 'string' ? descriptionOrOptions : descriptionOrOptions.description || 'Success';
  const status = typeof descriptionOrOptions === 'string' ? statusCode : descriptionOrOptions.statusCode || 200;
  const type = typeof descriptionOrOptions === 'string' ? undefined : descriptionOrOptions.type;
  const isArray = typeof descriptionOrOptions === 'string' ? false : descriptionOrOptions.isArray || false;

  const errorSchema = {
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      message: { 
        oneOf: [
          { type: 'string' },
          { type: 'array', items: { type: 'string' } }
        ]
      },
      error: { type: 'string' },
    }
  };

  const decorators = [
    ApiOperation({ summary: description }),
    ApiBadRequestResponse({ 
      description: 'Bad Request', 
      schema: { 
        type: 'object', 
        properties: { 
          statusCode: { type: 'number', example: 400 }, 
          message: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] }, 
          error: { type: 'string', example: 'Bad Request' } 
        } 
      } 
    }),
    ApiForbiddenResponse({ 
      description: 'Forbidden', 
      schema: { 
        type: 'object', 
        properties: { 
          statusCode: { type: 'number', example: 403 }, 
          message: { type: 'string' }, 
          error: { type: 'string', example: 'Forbidden' } 
        } 
      } 
    }),
    ApiNotFoundResponse({ 
      description: 'Not Found', 
      schema: { 
        type: 'object', 
        properties: { 
          statusCode: { type: 'number', example: 404 }, 
          message: { type: 'string' }, 
          error: { type: 'string', example: 'Not Found' } 
        } 
      } 
    }),
    ApiInternalServerErrorResponse({ 
      description: 'Internal Server Error', 
      schema: { 
        type: 'object', 
        properties: { 
          statusCode: { type: 'number', example: 500 }, 
          message: { type: 'string' }, 
          error: { type: 'string', example: 'Internal Server Error' } 
        } 
      } 
    }),
    ApiExtraModels(ApiMessage, ApiMessageData, ApiMessageDataPagination),
  ];

  if (type) {
    decorators.push(ApiExtraModels(type));

    const responseSchema = {
      allOf: [
        { $ref: getSchemaPath(isArray ? ApiMessageDataPagination : ApiMessageData) },
        {
          properties: {
            data: isArray 
              ? { type: 'array', items: { $ref: getSchemaPath(type) } }
              : { $ref: getSchemaPath(type) }
          }
        }
      ]
    };

    decorators.push(ApiResponse({ status, description: SuccessResponseMessages.successGeneral, schema: responseSchema }));
  } else {
    decorators.push(ApiResponse({ status, description: SuccessResponseMessages.successGeneral, type: ApiMessage }));
  }

  return applyDecorators(...decorators);
}
