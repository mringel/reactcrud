/*
 * This file has been edited  and modified from Facebook's example.
 */

var DeleteButton = React.createClass({
	handleClick: function() {
		console.log(this.props._id);
		$.ajax({
			method: 'DELETE',
      url: '/api/comments/' + this.props._id,
      // dataType: 'json',
      // cache: false,
      success: function(data) {
      	console.log("deleted");
      },
    	error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
	},

	render: function() {
		return <button onClick={this.handleClick}>Delete Me!</button>;
	}

});

var Comment = React.createClass({

  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author} <span className="timestamp"> @  {this.props.time}</span>
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()}  />
        <DeleteButton  _id={this.props._id} />
				<EditButton data={this.props.data}/>
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
    	method: "GET",
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comment.timestamp = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>We are better than FaceBook and you know it!</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment data={comment} author={comment.author} _id={comment._id} time={comment.timestamp} key={comment._id}>
          {comment.text}

        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}

      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Say something..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var EditButton = React.createClass({
	getInitialState: function() {
		return { showForm: false };
	},

	handleClick: function() {
		this.setState({ showForm: true});
		console.log("Edit button clicked");
	},

	render: function() {
		return (
			<div>
				<button onClick={this.handleClick}>Edit Comment</button>
				{this.state.showForm ? <EditForm data={this.props.data}/> : null}
			</div>
		);
	}

});

var EditForm = React.createClass({
	getInitialState: function() {
		return {author: '', text: ''};
	},

	handleAuthorChange: function(e) {
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },

	handleSubmit: function(e) {
		e.preventDefault();
		console.log("form submitted");
		// EditButton.setState({ showForm: false });
		var thedata = {author: this.state.author, text: this.state.text}
		$.ajax({
      method: 'PUT',
      dataType: 'json',
      data: thedata,
      url: '/api/comments/' + this.props.data._id,
      success: function(data) {
        console.log("updated!!!")
      },
      error: function(xhr, status, err) {
        console.log(err)
      }
    });
	},

	render: function() {
			return (
				<form className="editForm" onSubmit={this.handleSubmit}>
					<input
						type="text"
						placeholder={this.props.data.author}
						value={this.state.author}
						onChange={this.handleAuthorChange}
						/>
					<input
						type="text"
						placeholder={this.props.data.text}
						value={this.state.text}
						onChange={this.handleTextChange}
					/>
					<input type="submit" />
				</form>
			);
	}
});

ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
