json.total_count @search_results.total_count
json.results do
  json.array! @search_results do |result|
    result = result.searchable
    next unless result.account && current_user.accounts.include?(result.account)
    json.partial!("api/transactions/transaction", transaction: result)
  end
end
