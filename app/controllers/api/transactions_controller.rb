class Api::TransactionsController < ApplicationController

  before_action :redirect_logged_out_users

  def index
    @transactions = current_user.transactions.includes(:institution, :account)
    render :index
  end

  def update
    @transaction = Transaction.includes(:institution, :account).find(params[:transaction][:id])
    @transaction.update!(transaction_params)
    render :show
  end

  def show
    @transaction = Transaction.includes(:institution, :account).find(params[:id])
    render :show
  end

  private
  def transaction_params
    params.require(:transaction).permit(
      :transaction_id,
      :amount,
      :description,
      :notes,
      :date,
      :is_private?,
      :category,
      :account_id
    )
  end

end
