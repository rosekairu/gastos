class ChangeTransactionTable < ActiveRecord::Migration[6.1]
  def change
    remove_column :transactions, :description
    add_column :transactions, :description, :string
  end
end
