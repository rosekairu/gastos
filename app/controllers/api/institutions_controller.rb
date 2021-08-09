class Api::InstitutionsController < ApplicationController

  before_action :redirect_logged_out_users

  def index
    @institutions = Institution.all
    render :index
  end

  def create
    @institution = current_user.institutions.new(institution_params)

    if @institution.save
      # redirect_to api_institution_url(@institution)
      render :show
    else
      flash.now[:errors] = ["Invalid name or url"]
      render :new
    end
  end

  def new
    institution = Institution.new
  end

  private
  def institution_params
    params.require(:institution).permit(:name, :url, :logo_url)
  end

end
