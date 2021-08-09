json.partial! 'api/accounts/account', account: @account

json.transactions do
  json.array! @account.transactions do |transaction|
    json.partial! 'api/transactions/transaction', transaction: transaction
  end
end
