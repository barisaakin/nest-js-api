import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

export class EntityNotFoundException extends BusinessException {
  constructor(entityName: string) {
    super(`${entityName} not found`, HttpStatus.NOT_FOUND);
  }
}

export class EntityAlreadyExistsException extends BusinessException {
  constructor(entityName: string, field: string) {
    super(`${entityName} with this ${field} already exists`, HttpStatus.CONFLICT);
  }
}

export class BusinessRuleViolationException extends BusinessException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ValidationException extends BusinessException {
  constructor(message: string) {
    super(`Validation error: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

export class InvalidRelationException extends BusinessException {
  constructor(message: string) {
    super(`Invalid relation: ${message}`, HttpStatus.BAD_REQUEST);
  }
} 