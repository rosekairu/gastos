class CreateTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :transactions do |t|
      t.integer :account_id, null: false
      t.decimal :amount, precision: 8, scale: 2, null: false
      t.string :description, null: false
      t.text :notes
      t.datetime :date, null: false
      t.boolean :is_private?, default: true

      t.timestamps
    end

    add_index :transactions, :account_id
  end
end
