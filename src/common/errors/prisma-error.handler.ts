import { Prisma } from '@prisma/client';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  BusinessRuleViolationException,
} from '../exceptions/business.exception';

export class PrismaErrorHandler {
  static handle(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': {
          const field = error.meta?.target?.[0] as string;
          throw new EntityAlreadyExistsException('Entity', field);
        }
        case 'P2025':
          throw new EntityNotFoundException('Entity');
        default:
          throw error;
      }
    }
    throw error;
  }

  static handleDeleteWithRelations(
    error: unknown,
    entityName: string,
    relatedEntities: { name: string; count: number }[],
  ): never {
    if (relatedEntities.length > 0) {
      const message = `Cannot delete ${entityName} because it has: ${relatedEntities
        .map((rel) => `${rel.count} ${rel.name}`)
        .join(', ')}`;
      throw new BusinessRuleViolationException(message);
    }
    throw error;
  }
} 