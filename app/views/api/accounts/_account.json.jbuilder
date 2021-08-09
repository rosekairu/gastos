json.extract! account, :id, :name, :account_type

json.institution account.institution.name
json.balance number_to_currency(account.balance, precision: 2)
json.balance_n account.balance
