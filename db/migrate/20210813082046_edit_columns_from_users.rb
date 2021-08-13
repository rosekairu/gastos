class EditColumnsFromUsers < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :fname
    remove_column :users, :lname
    remove_column :users, :age 
  end
end

