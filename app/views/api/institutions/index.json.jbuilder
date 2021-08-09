json.array! @institutions do |institution|
  json.partial! 'institution', institution: institution
end
