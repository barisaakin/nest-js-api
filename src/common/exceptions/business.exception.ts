import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entity: string) {
    super(`${entity} not found`, HttpStatus.NOT_FOUND);
  }
}

export class EntityAlreadyExistsException extends HttpException {
  constructor(entity: string, field: string) {
    super(`${entity} with this ${field} already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidRelationException extends HttpException {
  constructor(entity: string, relatedEntity: string) {
    super(`Invalid ${relatedEntity} for this ${entity}`, HttpStatus.BAD_REQUEST);
  }
}

export class BusinessRuleViolationException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
} 