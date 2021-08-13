class CreateAccountsAndInstitutions < ActiveRecord::Migration[6.1]
  def change
    create_table :institutions do |t|
      t.string :name, null: false
      t.string :url
      t.string :logo_url

      t.timestamps
    end

    create_table :accounts do |t|
      t.string :name, null: false
      t.string :institution_id, null: false
      t.string :user_id, null: false
      t.decimal :balance, precision: 8, scale: 2, null: false
      t.string :account_type, null: false

      t.timestamps
    end


    add_index :accounts, :user_id
    add_index :accounts, :institution_id
    add_index :institutions, :name, unique: true
  end
end
