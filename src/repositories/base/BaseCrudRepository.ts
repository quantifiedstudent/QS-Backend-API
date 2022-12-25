import DatabaseConnection from '../database_connection';
import Repository from '../../interfaces/repository.interface';

export default class BaseCrudRepository implements Repository {
  // Create base repository
  db: DatabaseConnection;

  tableName: string;

  constructor(tableName: string) {
    this.db = new DatabaseConnection();
    this.tableName = tableName;
  }
}
