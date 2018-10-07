exports.isTypeDefinition = function() {
  if (this && this.customTags) {
    var remarkTag = this.customTags.find(item => item.tag === 'remark')
    return remarkTag && remarkTag.value === 'type definition'
  }
  return false
}
