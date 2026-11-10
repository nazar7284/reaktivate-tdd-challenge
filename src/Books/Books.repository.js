import ApiGateway from "../Shared/ApiGateway.js";

class BooksRepository {
  constructor() {
    this.httpGateway = new ApiGateway();
  }

  getBooks = async (privateOnly = false) => {
    const booksDto = await this.httpGateway.get(privateOnly ? "/private" : "/");
    return Array.isArray(booksDto) ? booksDto : [];
  };

  addBook = async ({ name, author }) => {
    const bookAddDto = await this.httpGateway.post("/", { name, author });
    return !!(bookAddDto && bookAddDto.status === "ok");
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
