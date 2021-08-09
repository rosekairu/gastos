# == Schema Information
#
# Table name: transactions
#
#  id          :integer          not null, primary key
#  account_id  :integer          not null
#  amount      :decimal(8, 2)    not null
#  notes       :text
#  date        :datetime         not null
#  is_private? :boolean          default(TRUE)
#  created_at  :datetime
#  updated_at  :datetime
#  description :string
#  category    :string           default("UNCATEGORIZED")
#

class Transaction < ActiveRecord::Base
  attr_accessor :total_count

  validates :account, :amount, :description, :date, presence: true

  belongs_to :account
  has_one :user, through: :account, source: :user
  has_one :institution, through: :account, source: :institution

  default_scope { order('date DESC') }

  def institution_id
    institution.id
  end


  include PgSearch
  multisearchable :against => [:description, :category, :amount, :date, :account_id]

end
