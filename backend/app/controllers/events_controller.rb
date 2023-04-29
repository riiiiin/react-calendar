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
    followers = Follow.where(follow_id: params[:user_id], isApprove: "false")
    visible_follows = Follow.where(users_id: params[:user_id], isApprove: "true")
    followers_info = []
    visible_follows_id = []
    for data in followers do
      followers_info << data[:users_id]
    end
    for data in visible_follows do
      visible_follows_id << data[:follow_id]
    end
    if visible_follows.length == 0
      render json: { allEvent: Event.where(user_id: params[:user_id]), followers: followers, followers_info: User.where(id: followers_info) }
    else
      render json: { allEvent: Event.where(user_id: params[:user_id]), visible_follows_event: Event.where(user_id: visible_follows_id) , followers: followers, followers_info: User.where(id: followers_info) }
    end
  end

  def createFollow
    follow_user = User.find_by(name: params[:follow_name], email: params[:follow_mail])
    data = {"users_id"=>params[:user_id], "follow_id"=>follow_user[:id], "isApprove"=>"false"}
    follow = Follow.new(data)
    if follow.save!
      render json: {message: "success"}
    else
      render json: {message: "error"}
    end
  end

  def updateFollow
    follow = Follow.find_by(users_id: params[:follower_id], follow_id: params[:user_id])
    if params[:is_approve] == 'true'
      follow.update(isApprove: 'true')
      render json: {message: follow}
    else
      if follow.destroy
        render json: {message: "success"}
      else
        render json: {message: "error"}
      end
    end
  end


end
