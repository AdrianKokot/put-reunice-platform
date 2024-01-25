import {
  deleteUser,
  uca10,
  uca11,
  uca12,
  uca5,
  uca_7_8_9,
} from './use-cases/main-administrator';
import { E2EUser, login, loginWith, rememberLogin, UserPage } from '../support';
import {
  ucua1,
  ucua2,
  ucua3,
  ucua4,
  ucua5,
  ucua6,
  ucua7,
} from './use-cases/university-administrator';
import { uc1 } from './use-cases/uc-1';
import {
  ucuu1,
  ucuu10,
  ucuu11,
  ucuu12,
  ucuu2,
  ucuu3,
  ucuu4,
  ucuu5,
  ucuu6,
  ucuu7,
  ucuu8,
  ucuu9,
} from './use-cases/university-user';
import { ucan1, ucan2, ucan3, ucan4, ucan5 } from './use-cases/anonymous-user';

const testTimestamp = Date.now().toString();

describe('Use Cases', () => {
  uc1();

  describe('1. Main Administrator', () => {
    rememberLogin(() => login(E2EUser.MAIN_ADMIN));

    uca10(testTimestamp);
    uca11(testTimestamp);
    uca5(testTimestamp);
    uca_7_8_9(testTimestamp);
  });

  describe('2. University Administrator', () => {
    rememberLogin(() =>
      loginWith(
        `moderator${testTimestamp}`,
        UserPage.defaultFormValue.password,
      ),
    );

    ucua1(testTimestamp);
    ucua2(testTimestamp);
    ucua3(testTimestamp);
    ucua5(testTimestamp);
    ucua6(testTimestamp);
    ucua7(testTimestamp);
  });

  describe('3. University User', () => {
    rememberLogin(() => {
      loginWith(
        `edited_ua_user${testTimestamp}`,
        UserPage.defaultFormValue.password,
      );
    });

    ucuu8();
    ucuu9(testTimestamp);
    ucuu10(testTimestamp);
    ucuu11(testTimestamp);
    ucuu1(testTimestamp);
    ucuu2();
    ucuu3(testTimestamp);
    ucuu4(testTimestamp);
    ucuu5(testTimestamp);
    ucuu7(testTimestamp);
    ucuu12(testTimestamp);
  });

  describe('4. Anonymous', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    ucan1();
    ucan2();
    ucan3(testTimestamp);
    ucan4(testTimestamp);
    ucan5(testTimestamp);
  });

  describe('5. University User', () => {
    rememberLogin(() => {
      loginWith(
        `edited_ua_user${testTimestamp}`,
        UserPage.defaultFormValue.password,
      );
    });

    ucuu4(testTimestamp);
    ucuu6(testTimestamp);
  });

  describe('6. University Administrator', () => {
    rememberLogin(() => {
      loginWith(
        `moderator${testTimestamp}`,
        UserPage.defaultFormValue.password,
      );
    });

    ucua4(testTimestamp);
  });

  describe('7. Main Administrator', () => {
    rememberLogin(() => {
      login(E2EUser.MAIN_ADMIN);
    });

    deleteUser(testTimestamp);
    uca12(testTimestamp);
  });
});
