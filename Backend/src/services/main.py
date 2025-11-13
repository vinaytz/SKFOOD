from imagekitio import ImageKit
import os
import time
# SDK initialization

# from imagekitio import ImageKit
imagekit = ImageKit(
    private_key='private_8yu8K1xHz5brz7ACu4AyA7p1ciA=',
    public_key='public_E3n3DkLB4TFBQWqMu3RQt7af0bs=',
    url_endpoint='https://ik.imagekit.io/ubut71lld'
)

def image_file_upload(file_path, file_name):
    print("step1 - Starting upload process")

    try:
        # Check if file exists
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            print(f"Current directory: {os.getcwd()}")
            print(f"Files in current directory: {os.listdir('.')}")
            return None
        
        print(f"✓ File found: {file_path}")
        file_size = os.path.getsize(file_path)
        print(f"✓ File size: {file_size} bytes ({file_size/1024:.2f} KB)")

        # Read file
        print("Reading file...")
        with open(file_path, "rb") as f:
            file_data = f.read()
        print(f"✓ File read successfully: {len(file_data)} bytes")

        # Upload file
        print("Uploading to ImageKit...")
        start_time = time.time()
        
        result = imagekit.upload_file(
            file=file_data,
            file_name=file_name
        )
        
        elapsed = time.time() - start_time
        print(f"✓ Upload completed in {elapsed:.2f} seconds")

        print("step2")
        print("✅ Upload successful!")
        print(f"URL: {result.url if hasattr(result, 'url') else 'N/A'}")
        print(f"File ID: {result.file_id if hasattr(result, 'file_id') else 'N/A'}")
        print(f"Full response: {result}")
        return result

    except FileNotFoundError as e:
        print(f"❌ File Error: {e}")
    except Exception as e:
        print("❌ Error during upload:")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        
        # Try to extract more details
        if hasattr(e, 'status_code'):
            print(f"Status Code: {e.status_code}")
        if hasattr(e, 'message'):
            print(f"Message: {e.message}")
        if hasattr(e, 'response'):
            print(f"Raw Response: {e.response}")
        
        import traceback
        print("\nFull traceback:")
        traceback.print_exc()

# Run test
if __name__ == "__main__":
    print("Starting upload test...")
    print(f"Python working directory: {os.getcwd()}")
    
    # Try with absolute path if relative doesn't work
    file_name = "Gemini_Generated_Image_a4pdpda4pdpda4pd.png"
    
    image_file_upload(file_name, "debug_test.png")