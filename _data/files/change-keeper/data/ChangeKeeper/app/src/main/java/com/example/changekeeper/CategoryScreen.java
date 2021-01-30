package com.example.changekeeper;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.widget.TextView;

import java.io.IOException;

public class CategoryScreen extends AppCompatActivity implements  CategoryDialog.CategoryDialogListener{
    private static final String TAG = ":(";
    public static final String EXTRA_MESSAGE = "com.example.CategoryScreen.MESSAGE";
    public static String[] info;
    private CategoryFragment infoFrag = new CategoryFragment();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActionBar toolbar = getSupportActionBar();
        toolbar = getSupportActionBar();
        toolbar.setTitle("Pick a category...");


        Intent intent = getIntent();
        info = intent.getStringArrayExtra(RegExpenseScreen.EXTRA_MESSAGE);
        setContentView(R.layout.activity_category_screen);

        FragmentManager fragmentManager = getSupportFragmentManager();
        infoFrag = (CategoryFragment)fragmentManager.findFragmentById(R.id.info);

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
        }
        return true;
    }

    public String[] getInfo(){
        return this.info;
    }

    @Override
    public void createCategory(String name, String imageName) {
        Log.i("Oi","lolol:/");
        try {
            this.infoFrag.updateCategories(name, imageName);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }

    @Override
    public void cancel() {

    }
}
