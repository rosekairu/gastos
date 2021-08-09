json.array! @accounts do |account|
  json.partial! 'account', account: account
end
