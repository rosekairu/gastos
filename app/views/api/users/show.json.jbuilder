json.extract! @user, :id, :email, :fname, :lname, :age, :gender
json.image_url asset_path(@user.avatar.url(:original))
