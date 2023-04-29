class CreateFollows < ActiveRecord::Migration[6.1]
  def change
    create_table :follows do |t|
      t.references :users, null: false, foreign_key: true
      t.integer :follow_id
      t.string :isApprove

      t.timestamps
    end
  end
end
