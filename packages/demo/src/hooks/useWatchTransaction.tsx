// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TransferParams } from "../types";
import { Form, FormInstance } from '@subwallet/react-ui';
import { useIsFirstRender } from 'usehooks-ts';

const useWatchTransaction = <T extends TransferParams, K extends keyof T>(key: K, form: FormInstance<T>, defaultData: T): T[K] => {
  const isFirstRender = useIsFirstRender();
  const watch = Form.useWatch(key, form);

  return isFirstRender ? defaultData[key] : watch;
};

export default useWatchTransaction;
