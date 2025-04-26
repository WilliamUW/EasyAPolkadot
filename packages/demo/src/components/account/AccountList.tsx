/* eslint-disable @typescript-eslint/no-floating-promises */
// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import { Button, ModalContext, SwList, Web3Block } from '@subwallet/react-ui'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  useConnectWallet,
  useNotifications,
  useSetChain
} from '@subwallet-connect/react'

import type { Account } from '@subwallet-connect/core/dist/types'
import CN from 'classnames'
import { GeneralEmptyList } from '../empty'
import { ScreenContext } from '../../context/ScreenContext'
import { SubstrateProvider } from '@subwallet-connect/common'
import SwAvatar from '@subwallet/react-ui/es/sw-avatar'
import { TRANSACTION_MODAL } from '../../constants/modal'
import { ThemeProps } from '../../types'
import TransactionModal from '../transaction/TransactionModal'
import { evmApi } from '../../utils/api/evmApi'
import styled from 'styled-components'
import { substrateApi } from '../../utils/api/substrateApi'
import { toShort } from '../../utils/style'
import { useNavigate } from 'react-router-dom'

interface Props extends ThemeProps {
  substrateProvider?: substrateApi
  evmProvider?: evmApi
}

type AccountMapType = {
  address: string
  name: string
  index: number
}

export const items = [
  {
    id: 1,
    name: 'Master Yoda',
    imageUrl:
      './assetThumbnails/Yoda.png'
  },
  {
    id: 2,
    name: 'Minecraft Wolf',
    imageUrl:
    './assetThumbnails/Wolf.png'
  },
  {
    id: 3,
    name: 'Miku Hatsune',
    imageUrl:
    './assetThumbnails/Miku.png'
  },
  {
    id: 4,
    name: 'Jeff Bezos',
    imageUrl:
    './assetThumbnails/Jeff.png'
  },
  {
    id: 5,
    name: 'OIIA OIIA Cat',
    imageUrl:
    './assetThumbnails/Cat.png'
  },
]

const modalId = TRANSACTION_MODAL
function Component({
  className,
  substrateProvider,
  evmProvider
}: Props): React.ReactElement {
  const [{ wallet }] = useConnectWallet()
  const { isWebUI } = useContext(ScreenContext)
  const renderEmpty = useCallback(() => <GeneralEmptyList />, [])
  const [accountsMap, setAccountMap] = useState<AccountMapType[]>([])
  const navigate = useNavigate()
  const [accountTransaction, setAccountTransaction] = useState<Account>()
  const [{ chains }] = useSetChain()
  const [, customNotification, updateNotify] = useNotifications()
  const { activeModal } = useContext(ModalContext)
  const [inputString, setInputString] = useState('')
  const [bought, setBought] = useState<boolean[]>([
    true,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
    true,
    false
  ])

  const onSignClicked = useCallback(
    (address: string, messageString: string, index?: number, item: object) => {
      return async () => {
        if (wallet) {
          const { update, dismiss } = customNotification({
            type: 'pending',
            message: 'Processing…',
            autoDismiss: 0
          })
          try {
            wallet.type === 'evm'
              ? await evmProvider?.signMessage(address)
              : await substrateProvider?.signMessage(
                  address,
                  wallet.provider as SubstrateProvider,
                  wallet.signer,
                  wallet.chains[0].id,
                  messageString
                )
            update({
              eventCode: 'dbUpdateSuccess',
              message: `Message signed successfully`,
              type: 'success',
              autoDismiss: 2000
            })
            if (index !== undefined) {
              console.log(`set index bought ${index}`)
              setBought(prevBought => {
                const newBought = [...prevBought]
                newBought[index] = true
                return newBought
              })
              alert(`🎉🥳 Congrats on buying ${item.name}!! 🎉🥳`)
            }
          } catch (e) {
            update({
              eventCode: 'dbUpdateError',
              message: `${(e as Error).message}`,
              type: 'error',
              autoDismiss: 2000
            })
          }
        }
      }
    },
    [evmProvider, substrateProvider]
  )

  const onTransactionClicked = useCallback(
    (address: string) => {
      return async () => {
        const account = wallet?.accounts.find(
          ({ address: address_ }) => address === address_
        )
        setAccountTransaction(account)
        account && activeModal(modalId)
      }
    },
    [activeModal, wallet]
  )

  useEffect(() => {
    const accountMap = wallet?.accounts.reduce((acc, account, index) => {
      acc.push({
        address: account.address,
        index,
        name: account.uns?.name || account.ens?.name || toShort(account.address)
      })
      return acc
    }, [] as AccountMapType[])

    setAccountMap(accountMap || [])
  }, [wallet?.accounts])

  const accountItem = useCallback(
    ({ address, name }: AccountMapType) => {
      const key = `${address}_${name}`
      const _middleItem = (
        <div className={'__account-item-middle'}>
          <div className={'__account-item-info'}>
            <span className="__account-item__title">Wallet name:</span>
            <span className="__account-item__content">
              <SwAvatar size={24} value={address} />
              <span className={'__account-item-name'}>{name}</span>
            </span>
          </div>
          <div className={'__account-item-info'}>
            <span className="__account-item__title">Address:</span>
            <span className="__account-item__content">{address}</span>
          </div>
          {/* 
          <div className={'__account-item-info'}>
            <Button
              className={CN('__wallet-btn', '__sub-wallet-sign-btn')}
              onClick={onSignClicked(address, `Signing as ${address}`)}
              block={true}
            >
              Sign Message
            </Button>

            <Button
              className={CN('__wallet-btn', '__sub-wallet-transaction-btn')}
              onClick={onTransactionClicked(address)}
              block={true}
            >
              Send Transaction
            </Button>
          </div> */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              gap: '20px',
              padding: '20px'
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  width: '250px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    objectFit: 'cover'
                  }}
                />
                <h3
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: '18px',
                    textAlign: 'center'
                  }}
                >
                  {item.name}
                </h3>
                <Button
                  className={CN('__wallet-btn', '__sub-wallet-sign-btn')}
                  onClick={onSignClicked(
                    address,
                    `Purchase ${item.name}`,
                    index,
                    item
                  )}
                  block={true}
                  disabled={bought[index]}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: bought[index] ? 'grey' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                >
                  {bought[index] ? 'Already Bought' : 'Buy Item'}
                </Button>
              </div>
            ))}
          </div>

        </div>
      )

      return (
        <>
          <Web3Block
            key={key}
            className={'__account-item'}
            middleItem={_middleItem}
          />
        </>
      )
    },
    [onSignClicked, onTransactionClicked, bought]
  )

  return (
    <>
      {accountsMap.length > 0 && (
        <>
          <SwList
            className={CN('__account-list', className, {
              '-isWeb': isWebUI
            })}
            list={accountsMap}
            renderWhenEmpty={renderEmpty}
            renderItem={accountItem}
          />
          {accountTransaction && (
            <TransactionModal
              senderAccount={accountTransaction}
              substrateProvider={substrateProvider}
              evmProvider={evmProvider}
            />
          )}
        </>
      )}
    </>
  )
}

export const AccountList = styled(Component)<Props>(({ theme: { token } }) => {
  return {
    '&.__account-list': {
      position: 'relative',
      width: '100%'
    },

    '&.-isWeb': {
      marginBottom: 200
    },

    '.__account-item': {
      padding: token.padding,
      width: '100%',
      marginBottom: token.marginSM,
      backgroundColor: token.colorBgSecondary,
      borderRadius: 8
    },

    '.__account-item-middle': {
      display: 'flex',
      flexDirection: 'column',
      gap: token.paddingSM,
      overflow: 'hidden'
    },

    '.__account-item-info': {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      overflow: 'hidden',
      gap: token.paddingSM
    },

    '.__account-item__title': {
      fontSize: token.fontSizeHeading6,
      fontStyle: 'normal',
      fontWeight: 600,
      width: 128,
      lineHeight: '22px',
      overflow: 'hidden'
    },

    '.__account-item__content': {
      display: 'flex',
      gap: token.paddingSM / 2,
      alignItems: 'center',
      textOverflow: 'ellipsis',
      fontSize: token.fontSizeHeading6,
      overflow: 'hidden',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '22px',
      color: token.colorTextLight4
    },

    '.__sub-wallet-transaction-btn': {
      backgroundColor: '#252525',

      '&:hover': {
        backgroundColor: '#363636'
      }
    }
  }
})

export default AccountList
