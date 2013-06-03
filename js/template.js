<script id="questionsTemplate" type=pc/template>
	<tr>
		<td><span class="badge badge-inverse">{{index}}</span></td>
		<td>{{type}}</td>
		<td>{{text}}</td>
		<td width="100px">
			<div class="toolbox">
				<div class="toolbar-edit" title="Edit"><i class="icon-pencil"></i></div>
				<div class="toolbar-delete" title="Delete"><i class="icon-trash"></i></div>
				<div class="toolbar-add" title="Add"><i class="icon-file"></i></div>
			</div>
		</td>
	</tr>
</script>
<script id="interviewsTemplate" type=pc/template>
	<tr>
		<td>{{name}}</td>
		<td>{{owner}}</td>
		<td>{{timestamp}}</td>
		<td>{{status}}</td>
		<td>{{applicants}}</td>
		<td>
			<div class="toolbox">
				<div class="toolbar-edit" title="Edit"><i class="icon-pencil"></i></div>
				<div class="toolbar-delete" title="Delete"><i class="icon-trash"></i></div>
				<div class="toolbar-add" title="Add"><i class="icon-file"></i></div>
			</div>
		</td>
	</tr>
</script>