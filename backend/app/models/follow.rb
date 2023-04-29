# == Schema Information
#
# Table name: follows
#
#  id         :bigint           not null, primary key
#  isApprove  :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  follow_id  :integer
#  users_id   :bigint           not null
#
# Indexes
#
#  index_follows_on_users_id  (users_id)
#
# Foreign Keys
#
#  fk_rails_...  (users_id => users.id)
#
class Follow < ApplicationRecord
  belongs_to :users, class_name: 'Follow', optional: true
end
