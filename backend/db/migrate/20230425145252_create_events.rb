class CreateEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :events do |t|
      t.references :user, null: false, foreign_key: true
      t.string :date
      t.string :title
      t.text :body
      t.string :name

      t.timestamps
    end
  end
end
