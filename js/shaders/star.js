var StarShader = {

	uniforms:
	{
		time: { type: "f", value: 1.0 },
		texture: { type: "t", value: null }
	},
	
	attributes:
	{
		color: { type: "c", value: [] },
		frequency: { type: 'f', value: [] }
	},

	vertexShader: [
	
		"uniform float time;",
		"attribute float frequency;",
		"attribute vec3 color;",
		"varying vec3 vColor;",
		"void main()",
		"{",
			"vColor = color;",
			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
		
			"gl_PointSize = (2.0 + sin(frequency * time)) * (500.0 / length(mvPosition.xyz));",
			"gl_Position = projectionMatrix * mvPosition;",
		"}"

	].join("\n"),

	fragmentShader: [
	
		"uniform sampler2D texture;",
		"varying vec3 vColor;",
		"void main()",
		"{",
			"gl_FragColor = vec4( vColor, 1.0 );",
			"gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);",
		"}"

	].join("\n")

};