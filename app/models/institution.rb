# == Schema Information
#
# Table name: institutions
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  url        :string
#  logo_url   :string
#  created_at :datetime
#  updated_at :datetime
#

class Institution < ActiveRecord::Base
  validates :name, presence: true, uniqueness: true

  has_many :accounts
  has_many :users, through: :accounts, source: :user
  has_many :transactions, through: :accounts, source: :transactions


end
