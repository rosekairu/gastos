class AddAttachmentAvatarToUsers < ActiveRecord::Migration[6.1]
    def self.up
        change_table :users do |t|
          t.attachment :avatar
          t.string :fname
          t.string :lname
          t.string :gender
          t.string :age
        end
      end
    
      def self.down
        remove_attachment :users, :avatar
      end
end
