class CreateCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false
      t.timestamps
    end

    add_index :categories, :name, unique: true
    add_column :transactions, :category_id, :integer
    add_index :transactions, :category_id

  end
end
