const mongoose = require("mongoose");

const mongooseDelete = require("mongoose-delete");
const { default: slugify } = require("slugify");

const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: { type: String, maxLength: 255, required: true },
    image: { type: String, maxLength: 255, required: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    slug: { type: String },
  },
  {
    timestamps: true,
  }
);

// Add Slug
Category.pre("save", async function (next) {
  if (!this.isModified("name")) {
    return next();
  }

  let slug = slugify(this.name, { lower: true, remove: /[*+~.()'"!:@0-9]/g });

  // Kiểm tra xem slug đã tồn tại trong cơ sở dữ liệu chưa
  let slugRegex = new RegExp(`^${slug}(-[0-9]*)?$`, "i");
  let existingCategories = await this.constructor.findWithDeleted({
    slug: slugRegex,
  });

  // Lấy danh sách các số hiện có trong các slug tương tự
  const usedNumbers = existingCategories.map((category) => {
    const match = category.slug.match(/-[0-9]+$/);
    return match ? parseInt(match[0]) * -1 : 0;
  });
  let suffix = 0;
  while (usedNumbers.includes(suffix)) {
    suffix++;
  }

  if (suffix > 0) {
    slug = `${slug}-${suffix}`;
  }

  this.slug = slug;
  next();
});

// Add plugins

Category.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

module.exports = mongoose.model("categories", Category);
