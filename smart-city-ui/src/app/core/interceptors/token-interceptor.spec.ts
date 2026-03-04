import { TestBed } from '@angular/core/testing';
import { TokenInterceptor } from './token-interceptor';
import { AuthService } from '../services/auth';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenInterceptor, AuthService],
    });

    interceptor = TestBed.inject(TokenInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
