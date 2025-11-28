import userReducer, { setCurrentUser, clearCurrentUser, loginUser } from '../userSlice';

const initialState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
};

const mockUser = {
  id: '1',
  role: 'regulateur',
  name: 'Ahmed',
  email: 'regulateur@gmail.com',
  password: 'password'
};

describe('userSlice', () => {
  test('should return the initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle setCurrentUser', () => {
    const actual = userReducer(initialState, setCurrentUser(mockUser));
    expect(actual.currentUser).toEqual(mockUser);
    expect(actual.error).toBeNull();
  });

  test('should handle clearCurrentUser', () => {
    const stateWithUser = { ...initialState, currentUser: mockUser };
    const actual = userReducer(stateWithUser, clearCurrentUser());
    expect(actual.currentUser).toBeNull();
  });

  test('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle loginUser.fulfilled', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.currentUser).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  test('should handle loginUser.rejected', () => {
    const action = { 
      type: loginUser.rejected.type, 
      error: { message: 'Login failed' } 
    };
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Login failed');
  });
});