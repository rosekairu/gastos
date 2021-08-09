json.array! @transactions do |transaction|
  next unless transaction.account
  json.partial! 'api/transactions/transaction', transaction: transaction
end
