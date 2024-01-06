import { uca10, uca11, uca5, uca_7_8_9 } from './use-cases/main-administrator';
import { E2EUser, login, loginWith, UserPage } from '../support';
import {
  ucua1,
  ucua2,
  ucua3,
  ucua5,
  ucua6,
  ucua7,
} from './use-cases/university-administrator';
import { uc1 } from './use-cases/uc-1';
import {
  ucuu1,
  ucuu12,
  ucuu2,
  ucuu3,
  ucuu4,
  ucuu5,
  ucuu7,
} from './use-cases/university-user';

const testTimestamp = Date.now().toString();
describe('Use Cases', () => {
  uc1();

  describe('1. Main Administrator', () => {
    beforeEach(() => {
      login(E2EUser.MAIN_ADMIN);
    });

    uca10(testTimestamp);
    uca11(testTimestamp);
    uca5(testTimestamp);
    uca_7_8_9(testTimestamp);
  });

  describe('2. University Administrator', () => {
    beforeEach(() => {
      loginWith(
        `moderator${testTimestamp}`,
        UserPage.defaultFormValue.password,
      );
    });

    ucua1(testTimestamp);
    ucua2(testTimestamp);
    ucua3(testTimestamp);
    ucua5(testTimestamp);
    ucua6(testTimestamp);
    ucua7(testTimestamp);
  });

  describe('3. University User', () => {
    beforeEach(() => {
      loginWith(
        `edited_ua_user${testTimestamp}`,
        UserPage.defaultFormValue.password,
      );
    });

    ucuu1(testTimestamp);
    ucuu2();
    ucuu3(testTimestamp);
    ucuu4(testTimestamp);
    ucuu5(testTimestamp);
    ucuu7(testTimestamp);
    ucuu12(testTimestamp);
  });
});
