# lluf-prompts-for-20240301

## Colab experiments for EMR162

**work-sharing-channel:** `#ll-work-ai-experiments`
**prereqs:** familiarity with Google Colab and Python
**prompt:** Christine is going to be leading a workshop for a course on Race, Ethics and AI, during which students will explore a number of AI tools in order to analyze the ways in which GAI tools intersect with questions and debates surround race and identity. We want a couple of Google Colabs that involve recursive operations with the AI tools, passing the output of one API call into a new API call (sometimes with a different tool entirely). We are also hoping to save the results of the users' experiments so that Christine can print or otherwise display some of these results at the end of the workshop for discussion.
**key contact:** Christine

## AI playground experiments for EMR162

**work-sharing-channel:** `##ll-work-ai-experiments`
**prereqs:** none
**prompt:** See above for context. Many students will interact largely with the playgrounds and not with the python code, so we also want to think about the same sorts of workflows, but as more manually-executed step-by-step processes. So the goal is to learn to log in to the major AI playgrounds and accounts and then experiment with using them to generate effects that will be helpful to Christine.
**key contact:** Christine

## Stable Diffusion experimentation for SLAVIC121

**work-sharing-channel:** `##ll-work-ai-experiments`
**prereqs:** familiarity with Automatic 1111
**prompt:** We want to experiment with adding preprocessor units of all sorts to images this term. For the ballet class coming up, we are particularly interested in the Open Pose preprocessor. Part of the goal for you as a LLUF is just to develop facility with this workflow (starting up stable diffusion and adding controlnet units). But we are also looking for interesting results using Open Pose (including the actual images that are visible in the image tab). So for this task, proceed as if you are undertaking scientific or quantitative research. Try to vary models and parameters slowly, one at a time, and to really keep track of this info, sharing not just final images, but also screenshots or notes about parameters and pre-processor images, etc., in the `#ll-work-ai-experiments` channel so that we see your work and hold on to the info we need to understand where we should go next.
**key contact:** Marlon

## Python Servers for Stable Diffusion

**work-sharing-channel:** `##ll-work-code`
**prereqs:** familiarity with python and a long-term investment in developing more complex applications
**prompt:** Learn to build a basic server in Python. Choose between Django and FastAPI (the former if you are going to go all in on building Python web apps, the latter if you just want to get things working fast and may be calling this API from a NextJS or other nodejs app or command-line tool anyway). Today's goal is to learn to handle request parameters of various sorts:

1. **Path Parameters**: learn to capture values from the path of a URL (like `myawesomeapi.com/items/{item_id}`). This is valuable for handling operations on individual resources, such as retrieving a specific item by its `item_id`.
2. **Query Strings**: learn how to parse query parameters for filtering, searching, or sorting data (like `myawesomeapi.com/items?category=books&sort=asc`), which are appended to the URL after the `?` mark.
3. **Request Body**: learn to handle complex data that can't be passed through the URL, like JSON or form data, which clients send through the body of POST or PUT requests.

As you do your testing, you are certainly welcome to immediately start generating things with SD. But for now, it could make most sense to just concentrate on taking in data that has relevant structures of your goals. So for complex prompting that involves model requests, you'll definitely need to at LEAST use query strings, and probably more likely POST requests. But once an image has been generated and has a timestamp or id, we could certainly offer that image to users at `myawesomeapi.com/images/{image_ts}` say.
**key contact:** Marlon
