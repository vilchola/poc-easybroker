export class Metadata {
  limit: number;
  page: number;

  constructor(limit = 20, page = 1) {
    this.limit = limit;
    this.page = page;

    if (this.limit > 50) {
      throw new Error('Max results per page: 50');
    }
  }
}
