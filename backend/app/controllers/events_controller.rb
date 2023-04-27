class EventsController < ApplicationController
  def create
    event = Event.new(params.permit(:body, :date, :name, :title, :user_id))
    if event.save
      render json: { message: "success"}
    else
      render json: { aaa: "error"}
    end
  end

  def destroy
    event = Event.find_by(id: params[:id])
    if event.destroy
      render json: { message: "success" }
    else
      render json: { message: "false" }
    end
  end

  def index
    render json: { allEvent: Event.where(user_id: params[:user_id]) }
  end
end
