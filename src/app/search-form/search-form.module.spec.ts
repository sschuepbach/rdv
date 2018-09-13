import { SearchFormModule } from './search-form.module';

describe('SearchFormModule', () => {
  let searchFormModule: SearchFormModule;

  beforeEach(() => {
    searchFormModule = new SearchFormModule();
  });

  it('should create an instance', () => {
    expect(searchFormModule).toBeTruthy();
  });
});
