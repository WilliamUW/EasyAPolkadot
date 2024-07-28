/* eslint-disable @typescript-eslint/no-floating-promises */
// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import { Button, ModalContext, SwList, Web3Block } from '@subwallet/react-ui'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import type { Account } from '@subwallet-connect/core/dist/types'
import {
  useConnectWallet,
  useNotifications,
  useSetChain
} from '@subwallet-connect/react'
import { SubstrateProvider } from '@subwallet-connect/common'
import { GeneralEmptyList } from '../empty'
import { ThemeProps } from '../../types'
import CN from 'classnames'
import { evmApi } from '../../utils/api/evmApi'
import { substrateApi } from '../../utils/api/substrateApi'
import { toShort } from '../../utils/style'
import TransactionModal from '../transaction/TransactionModal'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { TRANSACTION_MODAL } from '../../constants/modal'
import SwAvatar from '@subwallet/react-ui/es/sw-avatar'
import { ScreenContext } from '../../context/ScreenContext'

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
    name: 'Brown Wooden Cube',
    imageUrl:
      'https://cdn.discordapp.com/attachments/1234940320408539178/1266774052882878464/Screenshot_2024-07-27_at_11.03.58_AM.png?ex=66a65ec5&is=66a50d45&hm=61f3c9ab1c9eb2f4ab489187334045b23dda4b9bb7dc24e25c8e4a44e0993130&'
  },
  {
    id: 2,
    name: 'Blue Plastic Sphere',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774053872599051/Screenshot_2024-07-27_at_11.06.10_AM.png?ex=66a65ec5&is=66a50d45&hm=e787e73caa4918c22fd938a08458841941950f4fecda6feefe4b2c2ff97b246c&=&format=webp&quality=lossless&width=1168&height=1038'
  },
  {
    id: 3,
    name: 'Cute Green Alien',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774094716731422/Screenshot_2024-07-27_at_11.06.34_AM.png?ex=66a65ecf&is=66a50d4f&hm=abfbe920148637edd57663696ee771a278df357727a48cf8bceccbbbafd255e0&=&format=webp&quality=lossless&width=1187&height=1038'
  },
  {
    id: 4,
    name: 'Cute Red Alien',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774093890453615/Screenshot_2024-07-27_at_11.06.38_AM.png?ex=66a65ecf&is=66a50d4f&hm=0d6ed374ae87af08f670a443b57de323c811c48cfa3d1527665c3c30ff8e2b6b&=&format=webp&quality=lossless&width=1152&height=1038'
  },
  {
    id: 5,
    name: 'Castle',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774095823896688/Screenshot_2024-07-27_at_11.06.28_AM.png?ex=66a65ecf&is=66a50d4f&hm=fd9d7b88620872951e28f90d58bc21a45f1a7015330e6fa81291678d6f0e031c&=&format=webp&quality=lossless&width=1076&height=1038'
  },
  {
    id: 6,
    name: 'Cute White Llama',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774092951064650/Screenshot_2024-07-27_at_11.06.46_AM.png?ex=66a65ecf&is=66a50d4f&hm=23a03df2ad81a73d247e96186884d893449c50d0b34a4ae5ac3dde04d1379ab7&=&format=webp&quality=lossless&width=920&height=1038'
  },
  {
    id: 7,
    name: 'Brown Wood Cone',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774054774378506/Screenshot_2024-07-27_at_11.05.08_AM.png?ex=66a65ec6&is=66a50d46&hm=db373250f91855dd261f45ddede9a4afd999d26500c58750803c5a341e391a57&=&format=webp&quality=lossless&width=995&height=918'
  },
  {
    id: 8,
    name: 'Rhombicuboctahedron',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774055545995384/Screenshot_2024-07-27_at_11.04.11_AM.png?ex=66a65ec6&is=66a50d46&hm=c4113c879b958d883d4a778909286367b1ffea80abf990f7f335e2cb457cc3bf&=&format=webp&quality=lossless&width=1110&height=1008'
  },
  {
    id: 9,
    name: 'Red Pyramid',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774055143608440/Screenshot_2024-07-27_at_11.04.31_AM.png?ex=66a65ec6&is=66a50d46&hm=4c7f5b39b9f0f3061b0677d89c7ff42ecb5dd632511a4a76a5888aace8e8d8e1&=&format=webp&quality=lossless&width=1145&height=912'
  },
  {
    id: 10,
    name: 'White Wood Cylinder',
    imageUrl:
      'https://media.discordapp.net/attachments/1234940320408539178/1266774053327343667/Screenshot_2024-07-27_at_11.06.18_AM.png?ex=66a65ec5&is=66a50d45&hm=cadc8b004bdcaeadeac0b2a8e9d2ea5df07f53299b8da9474a645a97b35708f8&=&format=webp&quality=lossless&width=796&height=1038'
  }
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
